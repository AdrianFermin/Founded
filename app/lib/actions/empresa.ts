'use server'
import mysql from 'mysql2/promise';
import { Empresa, Rating } from '../types';
import { hashObject } from '../cripto';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { storage } from '@/firebase/clientApp';

export async function createConn() {

    const connection = await mysql.createConnection({
        host: process.env.NEXT_PUBLIC_MYSQL_HOST,
        user: process.env.NEXT_PUBLIC_MYSQL_USER,
        password: process.env.NEXT_PUBLIC_MYSQL_PASS,
        database: process.env.NEXT_PUBLIC_MYSQL_DB,
    });

    return connection;
}

export async function getEmpresas(){
    try {
        const conn = await createConn();
        const [result, fields] = await conn.query("SELECT * FROM empresa");
        await conn.end();

        let responce:any[] = [];
        let options:Empresa[] = result as [];

        options.forEach(element => {
            let index = {value: element.name}
            responce.push(index);
        });
        return responce;
    } catch (error) {
        console.log(error)
    }
}

export async function getEmpresasByName(name: string){
    try {
        const conn = await createConn();
        const [result, fields] = await conn.query("SELECT * FROM empresa WHERE `name` = ?", [name]);
        await conn.end();

        return result;
    } catch (error) {
        console.log(error)
    }
}

export async function getEmpresasByRate(){
    try {
        const conn = await createConn();
        const [result, fields] = await conn.query("SELECT * FROM empresa ORDER BY rate DESC LIMIT 4");
        await conn.end();
        return result as Empresa[];
    } catch (error) {
        console.log(error)
    }
}

export async function getEmpresasByDate(){
    try {
        const conn = await createConn();
        const [result, fields] = await conn.query("SELECT * FROM empresa ORDER BY creation_date DESC LIMIT 4");
        await conn.end();
        return result as Empresa[];
    } catch (error) {
        console.log(error)
    }
}

export async function getEmpresasByFilters(filters: any){
    var keys = Object.keys(filters)
    
    if(keys.includes('searchFor')){
        keys = keys.filter(item => item !== 'searchFor')
    }

    let queryString = "SELECT * FROM empresa WHERE ";
    let queryValues:any[] = []
    keys.forEach((key, index) => {
        if(filters.searchFor == undefined || filters.searchFor == 'Empresas'){
            if(index != keys.length - 1){
                if(key == 'query'){
                    queryString = queryString.concat("name LIKE ? AND ")
                    queryValues[index] = '%' + filters.query + '%';
                } else if(key == 'rate'){
                    queryString = queryString.concat("rate >= ? AND ")
                    queryValues[index] = filters.rate;
                } else if(key == 'location'){
                    queryString = queryString.concat("location = ? AND ")
                    queryValues[index] = filters.location;
                } else if(key == 'category'){
                    queryString = queryString.concat("category = ? AND ")
                    queryValues[index] = filters.category;
                }
            } else {
                if(key == 'query'){
                    queryString = queryString.concat("name LIKE ?")
                    queryValues[index] = '%' + filters.query + '%';
                } else if(key == 'rate'){
                    queryString = queryString.concat("rate >= ?")
                    queryValues[index] = filters.rate;
                } else if(key == 'location'){
                    queryString = queryString.concat("location = ?")
                    queryValues[index] = filters.location;
                } else if(key == 'category'){
                    queryString = queryString.concat("category = ?")
                    queryValues[index] = filters.category;
                }
            }
        } else {
            if(index != keys.length - 1){
                if(key == 'query'){
                    queryString = queryString.concat("productos LIKE ? AND ")
                    queryValues[index] = '%' + filters.query + '%';
                } else if(key == 'rate'){
                    queryString = queryString.concat("rate >= ? AND ")
                    queryValues[index] = filters.rate;
                } else if(key == 'location'){
                    queryString = queryString.concat("location = ? AND ")
                    queryValues[index] = filters.location;
                } else if(key == 'category'){
                    queryString = queryString.concat("category = ? AND ")
                    queryValues[index] = filters.category;
                }
            } else {
                if(key == 'query'){
                    queryString = queryString.concat("productos LIKE ?")
                    queryValues[index] = '%' + filters.query + '%';
                } else if(key == 'rate'){
                    queryString = queryString.concat("rate >= ?")
                    queryValues[index] = filters.rate;
                } else if(key == 'location'){
                    queryString = queryString.concat("location = ?")
                    queryValues[index] = filters.location;
                } else if(key == 'category'){
                    queryString = queryString.concat("category = ?")
                    queryValues[index] = filters.category;
                }
            }
        }
    });

    queryString = queryString.concat(" ORDER BY rate DESC")
    const conn = await createConn();
    const [result, fields] = await conn.query(queryString, queryValues)
    conn.end();

    return result as Empresa[];
}

export async function getAllEmpresas(){
    const conn = await createConn()

    const [result, fields] = await conn.query("SELECT * FROM empresa ORDER BY rate DESC")
    conn.end()

    return result as Empresa[]
}

export async function getCategorias(){

    const conn = await createConn()

    const [result, fields] = await conn.query("SELECT * FROM categoria")
    conn.end();
    return result as any[];
}

export async function getLocations(){

    const conn = await createConn()

    const [result, fields] = await conn.query("SELECT * FROM locations")
    conn.end();
    return result as any[];
}

export async function getRatings(){

    const conn = await createConn()

    const [result, fields] = await conn.query("SELECT * FROM rating")
    conn.end();
    return result as Rating[];
}

export async function createRating(ratingValues: any){

    const conn = await createConn();

    await conn.query("INSERT INTO rating (empresa, name, rate, comment) VALUES (?, ?, ?, ?)",
    [ratingValues.empresa, ratingValues.name, ratingValues.rate, ratingValues.comment]);

    const [result, fields] = await conn.query("SELECT * FROM rating WHERE empresa = ?", [ratingValues.empresa]);

    if(Array.isArray(result)){
        const resultado = result as Rating[]
        if(resultado.length > 1){
            let rate = 0;
            resultado.forEach((element, index) => {
                rate = rate + element.rate;

                if(index == resultado.length - 1){
                    rate = rate / resultado.length;
                }
            });

            await conn.query("UPDATE empresa SET rate = ? WHERE id = ?", [rate, ratingValues.empresa])
        } else {
            await conn.query("UPDATE empresa SET rate = ? WHERE id = ?", [ratingValues.rate, ratingValues.empresa])
        }
    }

    conn.end();
}

export async function getEmpresaBySecret(code: string){

    const conn = await createConn()

    const [result, fields] = await conn.query("SELECT * FROM secret_code WHERE code = ?", [code])

    if(Array.isArray(result) && result.length > 0){
        let resultado = result as any[]
        const [empresa, campos] = await conn.query("SELECT * FROM empresa WHERE id = ?", [resultado[0].empresa])
        conn.end()
        return(Array.isArray(empresa) ? {empresa: empresa[0] as Empresa, res: 'OK'} : {})
    } else {
        conn.end()
        return {res: 'FAILED'}
    }
}

export async function getImages(){
    const conn = await createConn();

    const [result, fields] = await conn.query('SELECT * FROM images')
    conn.end();

    return result as any[];
}

export async function getImagesByCode(code: string){
    const conn = await createConn();

    const [result, fields] = await conn.query('SELECT * FROM secret_code WHERE code = ?', [code]);
    const resultado = result as any[]

    const [images, iField] = await conn.query('SELECT * FROM images WHERE empresa = ?', [resultado[0].empresa])
    conn.end();

    return images as any[];
}

export async function getPortadaImages(){
    const conn = await createConn();

    const [result, fields] = await conn.query('SELECT * FROM images WHERE id IN (?, ?, ?)',[4, 12, 16])
    conn.end();

    return result as any[];
}

export async function createEmpresa(data: Empresa){
    
    data.direction = data.direction == '' ? 'Tienda virtual' : data.direction;
    const conn = await createConn();
    await conn.query('INSERT INTO empresa (name, created_by, category, description, status, '
    + 'creation_date, rate, location, direction, instagram, facebook, whatsapp, '
    + 'telefono, productos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [data.name, data.created_by, data.category, data.description,
        data.status, data.creation_date, data.rate, data.location, data.direction, data.instagram, data.facebook,
        data.whatsapp, data.telefono, data.productos])
    
    const [result, fields] = await conn.query('SELECT * FROM empresa WHERE name = ? LIMIT 1', [data.name]);
    const resultado = result as Empresa[];

    const secret = await hashObject(data)
    await conn.query('INSERT INTO secret_code (empresa, code) VALUES (?, ?)', [resultado[0].id, secret])
    const [secretCode, sFields] = await conn.query('SELECT * FROM secret_code WHERE code = ?', [secret])
    conn.end();

    return secretCode as any[];
}

export async function createImages(name: string, id: number){
    
    const conn = await createConn()

    const imageRef = ref(storage, `images/${name}`)
    const list = await listAll(imageRef);
    list.items.forEach(async(item) => {
        const conn2 = await createConn();
        let url = await getDownloadURL(item);
        await conn2.query('INSERT INTO images (empresa, url) VALUES (?, ?)', [id, url])
        conn2.end();
    })

    conn.end();
}

export async function updateImages(name: string, id: number){
    
    const conn = await createConn()

    const imageRef = ref(storage, `images/${name}`)
    const list = await listAll(imageRef);
    const [result, fields] = await conn.query('SELECT * FROM images WHERE empresa = ?', [id])
    const resultado = result as any[];
    resultado.forEach(async(image) => {
        const conn2 = await createConn();
        await conn2.query('DELETE FROM images WHERE id = ?', [image.id])
        conn2.end();
    })
    await conn.query('ALTER TABLE images AUTO_INCREMENT = 1')
    list.items.forEach(async(item, index) => {
        const conn3 = await createConn();
        let url = await getDownloadURL(item);
        await conn3.query('INSERT INTO images (empresa, url) VALUES (?, ?)', [id, url])
        conn3.end();
    })

    conn.end();
}

export async function updateEmpresa(data: Empresa){
    
    data.direction = data.direction == '' ? 'Tienda virtual' : data.direction;
    const conn = await createConn();
    await conn.query('UPDATE empresa SET name = ?, created_by = ?, category = ?, description = ?, status = ?, '
    + 'creation_date = ?, rate = ?, location = ?, direction = ?, instagram = ?, facebook = ?, whatsapp = ?, '
    + 'telefono = ?, productos = ? WHERE id = ?', [data.name, data.created_by, data.category, data.description,
        data.status, data.creation_date, data.rate, data.location, data.direction, data.instagram, data.facebook,
        data.whatsapp, data.telefono, data.productos, data.id])

    const [secretCode, sFields] = await conn.query('SELECT * FROM secret_code WHERE empresa = ?', [data.id])
    conn.end();

    return secretCode as any[];
}