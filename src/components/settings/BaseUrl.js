export function BaseUrl(endpoint) {
  let url;

  // return (url = `http://localhost/wetrack/api/public/index.php/api${endpoint}`);
 

 return `https://track.rutepro.co.tz/api/public/index.php/api${endpoint}`;

  
}

export function StorageUrl(imgUrl){
    return 'https://track.routepro.co.tz/api/storage/app/'+imgUrl
    // return 'http://localhost/wetrack/api/storage/app/'+imgUrl;
}
