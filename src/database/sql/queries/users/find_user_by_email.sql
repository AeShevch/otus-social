SELECT id,
    username,
    email,
    password,
    created_at,
    updated_at
FROM users
WHERE email = $1;