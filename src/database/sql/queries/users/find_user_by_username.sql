SELECT id,
    username,
    email,
    password,
    created_at,
    updated_at,
    first_name,
    last_name,
    birth_date,
    gender,
    interests,
    city
FROM users
WHERE username = $1