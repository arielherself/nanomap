export function post(method,args) {
    const payload=args.join('@@');
    let res = '';
    let ft = async () => {
        const response = await fetch(`/api/${method}${payload.length?"?query=":""}${payload}`, {
            method: 'GET',
            // body: data
        });
        const response_data = await response.json();
        console.log(`Received: ${JSON.stringify(response_data)}`);
        return response_data;
    };
    return ft();
}