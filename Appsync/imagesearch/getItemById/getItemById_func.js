import { util } from '@aws-appsync/utils'

export function request(ctx) {
	const secret = 'xxxxx'
	const limit = ctx.args.limit ? ctx.args.limit : 100
	const skip = ctx.args.skip ? ctx.args.skip : 0
	const item_id = ctx.args.item_id
	return {
		method: 'POST',
		version: '2018-05-29',
		resourcePath: '/app/data-vzxgd/endpoint/data/v1/action/find',
		params: {
			headers: {
				'api-key': secret,
				'Content-Type': 'application/json',
				'Access-Control-Request-Headers': '*',
				Accept: 'application/json',
			},
			body: {
				dataSource: 'Sandbox',
				database: 'vectorsearch',
				collection: 'image_metadata',
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
