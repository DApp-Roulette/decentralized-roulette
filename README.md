# DApp Roulette | Typescript | Node JS 

```sh
sudo yarn install       

```

```sh
sudo npm run-script  build
```

### start:prod || start 
```sh
pm2 startup
pm2 start npm --name server-decentralized-dev  -- run "start" 
pm2 start npm --name server-decentralized-prod  -- run "start:prod" 
pm2 save
``` 

