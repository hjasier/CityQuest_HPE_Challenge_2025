from flask import Blueprint, request, jsonify
import yt_dlp
import re
import random
import string
import requests
import os

subtitles_bp = Blueprint('subtitles', __name__)
