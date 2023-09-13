echo "REACT_APP_URL=http://"$(hostname -I | cut -f1 -d' ') > client/.env
echo "URL=http://"$(hostname -I | cut -f1 -d' ') > server/.env
