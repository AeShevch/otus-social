SELECT id,
    user_id,
    first_name,
    last_name,
    birth_date,
    gender,
    interests,
    city,
    created_at,
    updated_at
FROM profiles
WHERE user_id = $1; 