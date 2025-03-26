import pandas as pd
import seaborn as sns
from textblob import TextBlob
import io
import nltk
from nltk.corpus import stopwords
import os
from dl_translate import TranslationModel
import matplotlib.pyplot as plt


try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

# Spanish stopwords
spanish_stopwords = set(stopwords.words('spanish'))

def preprocess_text(text):
    """
    Preprocess text by removing stopwords and converting to lowercase
    """
    if not isinstance(text, str) or not text.strip():
        return ""
    
    # Convert to lowercase and split into words
    words = text.lower().split()
    
    # Remove stopwords
    filtered_words = [word for word in words if word not in spanish_stopwords]
    
    return " ".join(filtered_words)

def analyze_sentiment(text):
    """
    Analyze the sentiment of Spanish text using TextBlob.
    """
    if not isinstance(text, str) or not text.strip():
        return 0
    
    # For Spanish text, we use TextBlob
    analysis = TextBlob(text)
    return analysis.sentiment.polarity

def categorize_sentiment(polarity):
    """
    Categorize sentiment based on polarity score
    """
    if polarity > 0.05:
        return "Positivo"
    elif polarity < -0.05:
        return "Negativo"
    else:
        return "Neutral"

def translate_comments(df, source_lang='Spanish', target_lang='English', batch_size=3, use_cpu=False):
    """
    Translate comments from Spanish to English using dl_translate
    
    Parameters:
    - df: DataFrame containing comments
    - source_lang: Source language code
    - target_lang: Target language code
    - batch_size: Number of comments to translate at once
    - use_cpu: If True, force CPU usage (slower but avoids GPU memory issues)
    - model_size: Size of the model ("small", "base", or "large")
    """
    print("Translating comments from Spanish to English...")
    
    # Device configuration
    device = "cpu" if use_cpu else "cuda"
    print(f"Using device: {device}")
    
    # Initialize the translator with specified model size
    translator = TranslationModel(device=device, model_or_path="mbart50" )
    print(translator.available_languages())
    
    # Create a progress counter
    total = len(df)
    translated_count = 0
    
    # Process in batches to manage memory
    df['comentario_translated'] = ""
    
    for i in range(0, len(df), batch_size):
        batch = df.iloc[i:i+batch_size]
        
        # Filter out empty comments
        to_translate = [text for text in batch['comentario'] 
                       if isinstance(text, str) and text.strip()]
        
        if to_translate:
            try:
                # Translate the batch
                translations = translator.translate(
                    to_translate, 
                    source=source_lang, 
                    target=target_lang
                )
                
                # Map translations back to dataframe
                trans_idx = 0
                for j, row in batch.iterrows():
                    if isinstance(row['comentario'], str) and row['comentario'].strip():
                        df.at[j, 'comentario_translated'] = translations[trans_idx]
                        trans_idx += 1
            
            except Exception as e:
                print(f"\nError during translation: {str(e)}")
                print("Continuing with next batch...")
                
                # Set empty translations for this batch
                for j, row in batch.iterrows():
                    if isinstance(row['comentario'], str) and row['comentario'].strip():
                        df.at[j, 'comentario_translated'] = row['comentario']
        
        # Update progress
        translated_count += len(batch)
        print(f"Translated {min(translated_count, total)}/{total} comments...", end="\r")
        
        # Try to free up memory if needed
        import gc
        import torch
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
    
    print(f"\nTranslation complete: {total} comments processed")
    return df

def analyze_reviews_from_csv(file_path=None, csv_text=None, translate=True):
    """
    Analyze sentiment from a CSV file or CSV text
    """
    if file_path:
        df = pd.read_csv(file_path)
    elif csv_text:
        df = pd.read_csv(io.StringIO(csv_text))
    else:
        raise ValueError("Either file_path or csv_text must be provided")
    
    df = df.dropna(subset=['comentario'])
    
    df['comentario_processed'] = df['comentario'].apply(preprocess_text)
    
    if translate:
        df = translate_comments(df)
    
    df['sentiment_score'] = df['comentario_translated'].apply(analyze_sentiment)
    
    df['sentiment'] = df['sentiment_score'].apply(categorize_sentiment)
    
    df['rating_sentiment_match'] = (
        ((df['puntuacion'] >= 4) & (df['sentiment_score'] > 0)) | 
        ((df['puntuacion'] <= 2) & (df['sentiment_score'] < 0)) | 
        ((df['puntuacion'] == 3) & (df['sentiment_score'].between(-0.2, 0.2)))
    )
    
    return df

def visualize_results(df):
    """
    Create visualizations of the sentiment analysis results
    """
    # Set up the figure
    plt.figure(figsize=(15, 12))
    
    # Plot 1: Overall sentiment distribution
    plt.subplot(2, 2, 1)
    sentiment_counts = df['sentiment'].value_counts()

    ax = sns.barplot(x=sentiment_counts.index, y=sentiment_counts.values, 
                    hue=sentiment_counts.index, palette='viridis', legend=False)
    plt.title('Distribución de Sentimientos', fontsize=14)
    plt.ylabel('Cantidad de Reseñas', fontsize=12)
    plt.xlabel('Sentimiento', fontsize=12)

    plt.subplot(2, 2, 2)
    type_sentiment = df.groupby('tipo_servicio')['sentiment_score'].mean().sort_values()

    sns.barplot(x=type_sentiment.index, y=type_sentiment.values, 
               hue=type_sentiment.index, palette='viridis', legend=False)
    plt.title('Sentimiento Promedio por Tipo de Servicio', fontsize=14)
    plt.ylabel('Puntaje de Sentimiento', fontsize=12)
    plt.xlabel('Tipo de Servicio', fontsize=12)
    plt.xticks(rotation=45)
    
    plt.subplot(2, 2, 3)
    sns.scatterplot(x='puntuacion', y='sentiment_score', data=df, hue='tipo_servicio', 
                   palette='viridis', s=100, alpha=0.7)
    plt.title('Puntuación vs. Sentimiento', fontsize=14)
    plt.xlabel('Puntuación', fontsize=12)
    plt.ylabel('Puntaje de Sentimiento', fontsize=12)
    plt.grid(True, linestyle='--', alpha=0.7)
    
    plt.subplot(2, 2, 4)
    
    df['fecha_clean'] = df['fecha'].astype(str).str.strip()
    df['fecha_dt'] = pd.to_datetime(df['fecha_clean'], errors='coerce', format='mixed')

    valid_dates_df = df.dropna(subset=['fecha_dt'])
    valid_dates_df['año'] = valid_dates_df['fecha_dt'].dt.year
    
    if not valid_dates_df.empty:
        time_sentiment = valid_dates_df.groupby('año')['sentiment_score'].mean()
        
        sns.lineplot(x=time_sentiment.index, y=time_sentiment.values, marker='o', linewidth=2)
        plt.title('Evolución del Sentimiento por Año', fontsize=14)
        plt.xlabel('Año', fontsize=12)
        plt.ylabel('Sentimiento Promedio', fontsize=12)
        plt.grid(True, linestyle='--', alpha=0.7)
    else:
        plt.text(0.5, 0.5, 'No valid date data available', 
                horizontalalignment='center', verticalalignment='center',
                transform=plt.gca().transAxes)
    
    plt.tight_layout()
    plt.savefig('analisis_sentimiento.png', dpi=300, bbox_inches='tight')
    print("\nVisualización guardada como 'analisis_sentimiento.png'")

def print_summary(df):
    """
    Print a summary of the sentiment analysis results
    """
    print("\n===== ANÁLISIS DE SENTIMIENTO =====")
    print(f"Total de reseñas analizadas: {len(df)}")
    
    # Overall sentiment counts
    sentiment_counts = df['sentiment'].value_counts()
    print("\n1. Distribución de Sentimientos:")
    for sentiment, count in sentiment_counts.items():
        percentage = count / len(df) * 100
        print(f"  {sentiment}: {count} ({percentage:.1f}%)")
    
    print("\n2. Sentimiento Promedio por Tipo de Servicio:")
    for service_type, group in df.groupby('tipo_servicio'):
        avg_score = group['sentiment_score'].mean()
        count = len(group)
        print(f"  {service_type} ({count} reseñas): {avg_score:.2f}")
    
    correlation = df['puntuacion'].corr(df['sentiment_score'])
    print(f"\n3. Correlación entre puntuaciones y sentimiento: {correlation:.2f}")
    
    print("\n4. Servicios con Mejor Sentimiento:")
    top_services = df.groupby('nombre_servicio')['sentiment_score'].mean().sort_values(ascending=False).head(3)
    for service, score in top_services.items():
        print(f"  {service}: {score:.2f}")
    
    print("\n5. Servicios con Peor Sentimiento:")
    bottom_services = df.groupby('nombre_servicio')['sentiment_score'].mean().sort_values().head(3)
    for service, score in bottom_services.items():
        print(f"  {service}: {score:.2f}")

if __name__ == "__main__":
    csv_data = open('opiniones_turisticas.csv', 'r').read()

    results_df = analyze_reviews_from_csv(csv_text=csv_data, translate=True)
    
    results_df.to_csv('opiniones_turisticas_translated.csv', index=False)
    
    print_summary(results_df)
    
    visualize_results(results_df)
    
    print("\nAnálisis de sentimiento completado.")