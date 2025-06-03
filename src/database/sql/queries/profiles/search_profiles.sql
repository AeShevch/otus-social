SELECT 
  p.user_id as id,
  p.first_name,
  p.last_name as second_name,
  p.birth_date as birthdate,
  array_to_string(p.interests, ', ') as biography,
  p.city
FROM profiles p
WHERE 
  p.first_name LIKE $1 || '%'
  AND p.last_name LIKE $2 || '%'
ORDER BY p.user_id; 