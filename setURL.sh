echo $"REACT_APP_SERVER_URL=http://"$(hostname -i | cut -f1 -d' ')":4000" > client/.env
echo $(tail $"CLIENT_URL=http://"$(hostname -i | cut -f1 -d' ')":3000" > server/.env