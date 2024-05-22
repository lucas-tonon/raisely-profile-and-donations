# Assumptions

1. I don't have to worry too much about number of "records" in DB and memory consumption
2. `POST /donations` endpoint knows which campaign profile to update through a body param
3. Should not create new "tables" besides `profiles` and `donations`
4. All future currencies will have the exchange rate to USD properly assigned
5. The charge card endpoint is synchronous and we can already know if the payment was successful or not


# Notes

## What I would do differently if this was not an exercise?

1. Add pagination to GET endpoints, which may have lots of results
2. Use different logic to get all parents for given `profileId` instead of building the cache. In a real scenario, querying all profiles multiple times to compute the hierarchy is not optimal, even more so because I don't expect parents to change
3. Add logs setup with traceId for easier debugging
4. Use in-memory database for integration tests
5. Improve local setup
6. Use transactions for DB operations that need to be done "together" (i.e, creating donation and updating profile totals)

# Running

## Setup

Assuming you have `npm` and `node` installed, run:

```
npm install
```

## Server

Run the command below to have your server running on port 8080
```
npm run start
```

### Examples

#### GET /profiles

```
curl --location 'http://localhost:8080/profiles'
```

#### GET /profiles/:profile/donations

```
curl --location 'http://localhost:8080/profiles/78afca18-8162-4ed5-9a7b-212b98c9ec87/donations'
```

#### POST /profiles/:profile/donations

```
curl --location 'http://localhost:8080/profiles/2ad19172-9683-407d-9732-8397d58ddcb2/donations' \
--header 'Content-Type: application/json' \
--data '{
    "donorName": "John Doe",
    "currency": "AUD",
    "amount": 1000
}'
```

#### POST /donations

```
curl --location 'http://localhost:8080/donations' \
--header 'Content-Type: application/json' \
--data '{
    "profileId": "78afca18-8162-4ed5-9a7b-212b98c9ec87",
    "donorName": "Jane Doe",
    "currency": "EUR",
    "amount": 1000
}'
```


## Tests

To execute unit tests

```
npm run test:unit
```

To execute integration tests

```
npm run test:integration
```

To execute all tests
```
npm run test
```