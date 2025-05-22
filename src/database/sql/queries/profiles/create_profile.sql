INSERT INTO profiles (
        user_id,
        first_name,
        last_name,
        birth_date,
        gender,
        interests,
        city
    )
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING id,
    user_id,
    first_name,
    last_name,
    birth_date,
    gender,
    interests,
    city,
    created_at,
    updated_at; 