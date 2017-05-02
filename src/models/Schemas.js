
export const cookieObjSchema = {
    "id": "/CookieObj",
    "type": "object",
    "properties": {
        "originalMaxAge":{"type": "date-time"},
        "expires":{"type": "date-time"},
        "httpOnly":{"type": "boolean"},
        "path":{"type": "string"}
    }
}

export const passportSchema = {
    "id": "/Passport",
    "type": "object",
    "properties": {
        "user":{
            "_id":{"type": "string"},
            "__v":{"type": "integer"},
            "google":{
                "id":{"type": "string"},
                "email":{"type": "string"},
                "name":{"type": "string"}
            }
        }
    },
    "required": ["user"]
}

export const cookieSchema = {
    "id": "/Cookie",
    "type": "object",
    "properties": {
        "cookie": {"$ref":"/CookieObj"},
        "passport": {"$ref":"/Passport" }
    }
}

export const userTokenSchema = {
    "id": "/UserToken",
    "type": "object",
    "properties": {
        "id": {"type": "string"},
        "email": {"type": "string"}
    },
    "required": ["id", "email"]
}

export const credentialsSchema = {
    "id": "/Credentials",
    "type": "object",
    "properties": {
        "identifier": {"type": "string"},
        "password": {"type": "string"}
    },
    "required": ["identifier", "password"]
}