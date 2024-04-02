import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
}

export async function hashObject(object: any): Promise<string> {

    const objectString = JSON.stringify({
        object,
        date: new Date()
    });

    const saltRounds = 10;
    const hashedObject = await bcrypt.hash(objectString, saltRounds);
    return hashedObject;
}

export async function hashObjectString(object: any): Promise<string> {

    const objectString = JSON.stringify({
        object,
        date: new Date()
    });

    const saltRounds = 10;
    const hashedObject = await bcrypt.hash(objectString, saltRounds);
    const cleanHash = hashedObject.replace(/[^\w\s]/gi, '');
    return cleanHash;
}