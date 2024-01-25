import { util } from '@aws-appsync/utils'

export function request(ctx) {
	console.log(ctx.info)
	console.log(ctx.args.input)
	switch (ctx.info.fieldName) {
		case 'listItems':
			return {}
		case 'addItem':
			const applicantData = {
				...ctx.args.input,
			}
			ctx.stash.applicantData = applicantData
			return {}
		case 'getItemById':
			const applicantData1 = {
				...ctx.args.input,
			}
			ctx.stash.applicantData = applicantData1
			return {}	
		default:
			return {}
	}
}

export function response(ctx) {
	console.log(ctx.prev.result)
	return ctx.prev.result
}