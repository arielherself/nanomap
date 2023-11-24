export function post(method,args) {
    const data = new FormData();
    data.append('method', method)
    data.append('payload', args.join(','));
    let res = '';
    let ft = async () => {
        const response = await fetch('http://127.0.0.1:825/', {
            method: 'POST',
            body: data
        });
        const response_data = await response.text();
        console.log(`Received: ${response_data}`);
        return response_data;
    };
    return ft();
};