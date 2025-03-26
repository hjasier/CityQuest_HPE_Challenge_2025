CREATE
OR REPLACE FUNCTION get_top_coin_earners_last_day() RETURNS TABLE (
    user_id UUID,
    username VARCHAR(100),
    total_coins_earned BIGINT
) AS $ $ BEGIN RETURN QUERY
SELECT
    u.id AS user_id,
    u.username,
    SUM(c.reward) AS total_coins_earned
FROM
    "User" u
    INNER JOIN "AcceptedChallenge" ac ON u.id = ac.user_id
    INNER JOIN "Challenge" c ON ac.challenge_id = c.id
WHERE
    ac.completed = TRUE
    AND ac.completed_at >= NOW() - INTERVAL '1 day'
    AND ac.completed_at <= NOW()
GROUP BY
    u.id,
    u.username
ORDER BY
    total_coins_earned DESC;

END;

$ $ LANGUAGE plpgsql;