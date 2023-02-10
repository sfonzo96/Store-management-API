const toParse = `{
  "_id": "Y0uzupB6gIVXSTGRrVpdg2LPJHfMXY0G",
  "expires": {
    "$date": {
      "$numberLong": "1676001602874"
    }
  },
  "session": "{\"cookie\":{\"originalMaxAge\":10000000,\"expires\":\"2023-02-10T04:00:02.274Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":{\"_id\":\"63e5988d3ec348439f261314\",\"firstName\":\"Santiago\",\"lastName\":\"Fonzo\",\"email\":\"santiagofonzo@live.com\",\"age\":26,\"cart\":{\"_id\":\"63e5988d3ec348439f261312\",\"products\":[],\"createdAt\":\"2023-02-10T01:06:21.719Z\",\"updatedAt\":\"2023-02-10T01:06:21.719Z\",\"__v\":0},\"role\":\"user\",\"createdAt\":\"2023-02-10T01:06:21.840Z\",\"updatedAt\":\"2023-02-10T01:06:21.840Z\",\"__v\":0}}}"
}`

const parsed = JSON.parse(toParse)
console.log(parsed)