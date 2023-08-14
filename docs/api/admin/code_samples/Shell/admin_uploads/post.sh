curl -X POST 'https://medusa-url.com/admin/uploads' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: image/jpeg' \
--form 'files=@"<FILE_PATH_1>"' \
--form 'files=@"<FILE_PATH_1>"'
