const capitals=JSON.parse(document.querySelector("#capital-data")?.textContent||"[]");
const root=document.querySelector("#arab-capitals-grid");
if(root){
 const flag=code=>{const value=String(code||"").toUpperCase();return /^[A-Z]{2}$/.test(value)?[...value].map(char=>String.fromCodePoint(127397+char.charCodeAt(0))).join(""):"🌐"};
 const card=city=>{
  const link=document.createElement("a");
  link.className="directory-card directory-card--unified";
  link.href="./global-weather/?lat="+encodeURIComponent(city.latitude)+"&lon="+encodeURIComponent(city.longitude)+"&name="+encodeURIComponent(city.capital);
  link.setAttribute("aria-label","عرض الطقس في "+city.capital+"، "+city.country);
  const media=document.createElement("span");media.className="directory-card__media is-photo-missing";
  const placeholder=document.createElement("span");placeholder.className="directory-card__photo-placeholder";placeholder.textContent=flag(city.countryCode);media.append(placeholder);
  const body=document.createElement("span");body.className="directory-card__body";
  const meta=document.createElement("span");meta.className="directory-card__meta";meta.textContent=flag(city.countryCode)+" · "+city.country;
  const title=document.createElement("strong");title.className="directory-card__title";title.textContent=city.capital;
  const action=document.createElement("span");action.className="directory-card__action";action.textContent="عرض الطقس ←";
  body.append(meta,title,action);link.append(media,body);return link;
 };
 root.replaceChildren(...capitals.slice(0,6).map(card));
}
