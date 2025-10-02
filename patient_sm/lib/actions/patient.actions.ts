/* export const createUser = async (user: CreateUserParams) => {
    try {
        const newUser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name
        )
    } catch (error) {
        if(error && error?.code ==409 ) {
            const existingUser = await users.list([
                Query.equal("email",[user.email]),
            ])
        }
    }
} */