import { util } from '@aws-appsync/utils'

export function request(ctx) {
	const secret = ctx.env.MDB_SECRET
	const limit = ctx.args.limit ? ctx.args.limit : 100
	const skip = ctx.args.skip ? ctx.args.skip : 0
	const item_id = ctx.args.item_id
	console.log("secret",secret)
	console.log("MDB_FIND_PATH",ctx.env.MDB_FIND_PATH)
	console.log("DATA_SOURCE",ctx.env.DATA_SOURCE)
	console.log("DB_NAME",ctx.env.DB_NAME)
	console.log("COLLECTION",ctx.env.COLLECTION)
	return {
		method: 'POST',
		version: '2018-05-29',
		resourcePath: ctx.env.MDB_FIND_PATH,
		params: {
			headers: {
				'api-key': secret,
				'Content-Type': 'application/json',
				'Access-Control-Request-Headers': '*',
				Accept: 'application/json',
			},
			body: {
				dataSource: ctx.env.DATA_SOURCE,
				database: ctx.env.DB_NAME,
				collection: ctx.env.COLLECTION,
				"filter": {
                "item_id": {
                    "$eq": item_id
        }
      },
      "limit": 1
			},
		},
	}
}

export function response(res) {
console.log(res)
	const records = JSON.parse(res.result.body).documents
	return records[0]
}
