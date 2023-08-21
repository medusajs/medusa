curl -X POST '{backend_url}/admin/uploads/protected' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: image/jpeg' \
--form 'files=@"<FILE_PATH_1>"' \
--form 'files=@"<FILE_PATH_1>"'
