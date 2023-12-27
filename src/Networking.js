import {sill} from "./tools/Debug";

export function post(type,method,args) {
    let ft = async () => {
        let response;
        if(type==='GET'){
            const payload=args.join('@@');
            response = await fetch(`/api/${method}${payload.length?"?query=":""}${payload}`, {
                method: 'GET',
            });
        }else if(type==='POST'){
            response = await fetch(`/api/${method}`, {
                method: 'POST',
                body: JSON.stringify(args),
            });
        }
        const response_data = await response.json();
        sill(`Request "${method}" finished:\n  ${response_data.log.replaceAll('\n','\n  ')}`);
        return response_data;
    };
    return ft();
}