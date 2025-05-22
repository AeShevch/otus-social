INSERT INTO users (
        username,
        email,
        password,
        first_name,
        last_name,
        birth_date,
        gender,
        interests,
        city
    )
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING id,
    username,
    email,
    created_at,
    updated_at,
    first_name,
    last_name,
    birth_date,
    gender,
    interests,
    city