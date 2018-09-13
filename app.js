const fs = require('fs');
const http = require('http');
const queryString = require('query-string');

const footer = fs.readFileSync('./footer.html').toString();
const header = fs.readFileSync('./header.html').toString();
const index = fs.readFileSync('./index.html').toString();

const home = fs.readFileSync('./home.html').toString();
const about = fs.readFileSync('./about.html').toString();
const contact = fs.readFileSync('./contact.html').toString();

const routeMap = new Map();

routeMap.set('home', home);
routeMap.set('about', about);
routeMap.set('contact', contact);

const generateContent = (template, additionalData) => {
  const links = additionalData.links.map(entry => {
    return `<li><a href="http://localhost:8800/?page=${entry}">${entry.toUpperCase()}</a></li>`;
  });
  
  const parsedFooter = footer
    .replace(/%%LINKS%%/g, 
    links.join('')
  );


  const page = template
    .replace(/%%HEADER%%/g, header)
    .replace(/%%FOOTER%%/g, parsedFooter);

  return index.replace(/%%PAGE%%/g, page);
};

const server = http.createServer((request, response) => {
  const params = queryString.parse(request.url.substring(2));

  let content = '';

  if (routeMap.has(params.page)) {
    content = generateContent(
      routeMap.get(params.page),
      {
        links: Array.from(routeMap.keys()),
      }
    );
  } else {
    content = "Page not found";
  }
    
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.end(content);
});

server.listen(8800);
