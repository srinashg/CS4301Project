# CS4301Project
CS 4301 team project

# Set Up Guide
When you just cloned the project for the first time, you need to install
all the necessary packages. We do it via npm.
```bash
cd CS4301Project                    #Enter project directory

##### CLIENT SETUP #####
cd client
npm install                         #Installing packages

##### BACKEND SETUP #####
cd ../backend
python3 -m venv venv
source venv/bin/activate            #Activate virtual env
pip install -r requirements.txt     #Install python packages

cd backend
cp example.env .env                 #Then fill in the secrets
```

# Running the client
This will run parcel to auto reload the client.
```bash
# In the /client directory

npm run start
```

## Configuration
You may need to adjust the address for the smart contract when you deploy it to your local development blockchain server.
You only need to do this on first run or when you change the contract (but you shouldn't change it).

### Deploying the smart contract
You can't use the contract if you don't deploy it locally.
```bash
# In the project directory

cd truffle          # Enter local smartcontract dir

npx truffle migrate
```

It will output something like this.

```bash
...

Address
0x86bbB651f011EAf0b74ab6906814A3F0b28c9670
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.001246152738264358 ETH

Summary
=======
> Total deployments:   1
> Final cost:          0.001246152738264358 ETH
```

Grab the hex address under **Address** and add it to a new file at the root of the project called `.env`

The content of `CS4301Project/.env` should be:
```bash
CONTRACT_ADDRESS=[the address you just grabbed, no quotes]
```

Now restart the client, you should be good.

# Running the backend
This will run Django 5.0
```bash
# In the /backend directory

source venv/bin/activate
python3 manage.py runserver
```