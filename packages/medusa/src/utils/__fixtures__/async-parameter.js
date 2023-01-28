	async function password(){

			return Promise.resolve("password");
		}  
module.exports = {
			projectConfig: {
			database_type: "sqlite",
			database_database: "./medusa-db.sql",
			admin_cors: "ADMIN_CORS",
			store_cors: "STORE_CORS",
			database_password:password
		  },
		  	plugins:[],
		};
