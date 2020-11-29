class Loader {

    constructor(resources = [], htmlURL = "https://static.redguy.ru/html/loader.html", cssURL = "https://static.redguy.ru/css/loader.css") {
        window.resource = resources.reverse();
        window.onload = Loader.onpageload;
        let x = new XMLHttpRequest();
        x.open("GET", htmlURL, true);
        x.onload = function () {
            let div = document.createElement('div');
            div.id = "load-roller";
            div.innerHTML = x.responseText;
            document.body.appendChild(div);
            document.body.style.visibility = "hidden";
            let link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("type", "text/css");
            link.setAttribute("href", cssURL);
            link.id = "load-css";
            document.getElementsByTagName("head")[0].appendChild(link);
        };
        x.send(null);
    }

    static onpageload() {
        if(window.resource.length > 0) {
            let x = window.resource.pop();
            if(typeof x === "string") {
                x = x.trim();
                console.log(x);
                if (x.endsWith("js")) {
                    let js = document.createElement("script");
                    js.src = x;
                    js.type = "text/javascript";
                    js.onload = Loader.onpageload;
                    document.head.appendChild(js);
                } else if (x.endsWith("css")) {
                    let link = document.createElement("link");
                    link.setAttribute("rel", "stylesheet");
                    link.setAttribute("type", "text/css");
                    link.setAttribute("href", x);
                    link.onload = Loader.onpageload;
                    document.head.appendChild(link);
                }
            } else {
                console.log(x.url+" with type "+x.type);
                switch (x.type) {
                    case "js":
                        let js = document.createElement("script");
                        js.src = x.url;
                        js.type = "text/javascript";
                        js.onload = Loader.onpageload;
                        break;
                    case "css":
                        let link = document.createElement("link");
                        link.setAttribute("rel", "stylesheet");
                        link.setAttribute("type", "text/css");
                        link.setAttribute("href", x.url);
                        link.onload = Loader.onpageload;
                        document.head.appendChild(link);
                        break;
                    case "audio":
                        let audio = window.audio;
                        audio.load(x.name,x.url);
                        Loader.onpageload();
                        break;
                    case "code":
                        x.cb();
                        Loader.onpageload();
                        break
                }
            }
        } else {
            let div = document.getElementById("load-roller");
            div.remove();
            let css = document.getElementById("load-css");
            css.remove();
            document.body.style.visibility = "visible";
        }
    }
}
