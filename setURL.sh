echo $"REACT_APP_SERVER_URL=http://"$(hostname -I | cut -f1 -d' ')":4000" > client/.env
echo $"CLIENT_URL=http://"$(hostname -I | cut -f1 -d' ')":3000" > server/.env