import supertest from "supertest";
import { web } from "../src/application/web.js";
import { prismaClient } from "../src/application/database.js";
import { logger } from "../src/application/logging.js";

// describe('POST /api/auth', function() {

//     afterEach(async () => {
//         prismaClient.user.deleteMany({
//             where: {
//                 username: "jotave97"
//             }
//         })
//     })

//     it('should can register new user', async () => {
//         const result = await supertest(web)
//         .post('/api/auth')
//         .send({
//             "username": "jotave97",
//             "email": "jotave9701@eimatro.com",
//             "phone": "085632564513",
//             "password": "jotave9701",
//             "confirmPassword": "jotave9701",
//             "FE_URL": "http://localhost:4000"
//         });

//         logger.info(JSON.stringify(result.body))

//         expect(result.status).toBe(200);
//         expect(result.body.data.email).toBe("jotave9701@eimatro.com");
//         expect(result.body.data.username).toBe("jotave97");
//         expect(result.body.data.phone).toBe("085632564513");
//         expect(result.body.data.FE_URL).toBeUndefined();
//     })
// });

describe('POST /api/auth/login', function() {

    it('should can login user', async () => {
        const result = await supertest(web)
        .post('/api/auth/login')
        .send({
            "username": "jotave97",
            "email": "ezytomie@gmail.com",
            "phone": "085632564513",
            "password": "jotave9701"
        });

        logger.info(result.body.data)

        expect(result.status).toBe(200);
        expect(result.body.data.email).toBe("ezytomie@gmail.com");
        expect(result.body.data.username).toBe("jotave97");
        expect(result.body.data.phone).toBe("085632564513");
    })
});