const canvas=document.getElementById("cardCanvas"),ctx=canvas.getContext("2d"),photoInput=document.getElementById("photoInput"),dropZone=document.getElementById("dropZone"),nameInput=document.getElementById("nameInput"),roleInput=document.getElementById("roleInput"),titleInput=document.getElementById("titleInput"),generateBtn=document.getElementById("generateBtn"),downloadBtn=document.getElementById("downloadBtn"),shareBtn=document.getElementById("shareBtn");let sourceImage=null,generated=false;const W=1600,H=1000;const C={green:"#206837",dark:"#154b29",yellow:"#ffe500",pink:"#f5007a",paper:"#f7f4ec",white:"#ffffff",ink:"#10140f",muted:"#5f665e"};
function fitCrop(img,x,y,w,h,fx=.5,fy=.5){const scale=Math.max(w/img.width,h/img.height),sw=w/scale,sh=h/scale,sx=Math.max(0,Math.min(img.width-sw,img.width*fx-sw/2)),sy=Math.max(0,Math.min(img.height-sh,img.height*fy-sh/2));ctx.drawImage(img,sx,sy,sw,sh,x,y,w,h)}
function drawText(text,x,y,size,weight=500,color=C.ink,font="Space Grotesk",align="left"){ctx.font=`${weight} ${size}px "${font}"`;ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline="alphabetic";ctx.fillText(text,x,y)}
function palm(x,y,s,flip=false){ctx.save();ctx.translate(x,y);ctx.scale(flip?-s:s,s);ctx.strokeStyle=C.yellow;ctx.fillStyle=C.green;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-18,-85,-8,-170);ctx.stroke();const leaves=[[0,-165,-70,-215],[0,-160,70,-215],[0,-150,-105,-165],[0,-145,105,-165],[0,-135,-70,-110],[0,-130,70,-105]];leaves.forEach(([sx,sy,ex,ey])=>{ctx.beginPath();ctx.moveTo(sx,sy);ctx.quadraticCurveTo((sx+ex)/2,ey-28,ex,ey);ctx.quadraticCurveTo((sx+ex)/2,ey+10,sx,sy);ctx.fill();ctx.stroke()});ctx.restore()}
function waves(x,y,w){ctx.strokeStyle=C.yellow;ctx.lineWidth=4;for(let i=0;i<3;i++){ctx.beginPath();for(let p=0;p<=w;p+=18){const yy=y+i*15+Math.sin(p/35)*4; if(p===0)ctx.moveTo(x+p,yy);else ctx.lineTo(x+p,yy)}ctx.stroke()}}
function drawCard(){ctx.clearRect(0,0,W,H);
  // Goa-green base inspired by the supplied reference palette.
  ctx.fillStyle=C.green;ctx.fillRect(0,0,W,H);
  // Cream central card field.
  ctx.fillStyle=C.paper;ctx.fillRect(54,54,1492,892);
  // Bright top band.
  ctx.fillStyle=C.yellow;ctx.fillRect(54,54,1492,76);
  drawText("HH GOA",84,105,27,800,C.green);
  drawText("BUILDER ID · 2026",1510,103,14,700,C.green,"DM Mono","right");
  // Decorative pink sun behind the heading.
  ctx.fillStyle=C.pink;ctx.beginPath();ctx.arc(1210,270,108,0,Math.PI*2);ctx.fill();
  // Goa palms and beach-wave details.
  palm(120,900,.72,false);palm(1480,900,.72,true);waves(1030,850,360);
  // Photo frame.
  const px=94,py=174,pw=590,ph=680;ctx.fillStyle=C.white;ctx.fillRect(px-10,py-10,pw+20,ph+20);ctx.fillStyle="#d9d4c9";ctx.fillRect(px,py,pw,ph);
  if(sourceImage)fitCrop(sourceImage,px,py,pw,ph,.5,.45);else{drawText("YOUR PHOTO",px+pw/2,py+ph/2,22,500,C.muted,"DM Mono","center")}
  // Pink corner tab.
  ctx.fillStyle=C.pink;ctx.fillRect(px,py,150,18);
  drawText("GOA · INDIA",px,py+ph+43,14,700,C.green,"DM Mono");
  // Right information area.
  const left=760,right=1470;
  drawText("HACKER HOUSE",left,184,14,600,C.green,"DM Mono");
  drawText("GOA",left,255,76,800,C.ink);
  drawText("2026",left,303,43,500,C.ink);
  // Builder title strip.
  ctx.fillStyle=C.yellow;ctx.fillRect(left,342,right-left,105);
  drawText((titleInput.value||"THE SHIP-IT BUILDER").toUpperCase(),left+24,385,27,800,C.ink);
  drawText("BUILDER PERSONA",left+24,423,11,600,C.green,"DM Mono");
  // Identity block.
  ctx.fillStyle=C.green;ctx.fillRect(left,485,92,92);drawText("HH",left+46,545,27,800,C.yellow,"DM Mono","center");
  drawText((nameInput.value||"YOUR NAME").toUpperCase(),left+120,525,43,800,C.ink);
  drawText((roleInput.value||"STACK / ROLE").toUpperCase(),left+120,557,16,600,C.muted,"DM Mono");
  // Divider and event details.
  ctx.strokeStyle="#b9c0b7";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(left,625);ctx.lineTo(right,625);ctx.stroke();
  drawText("28 — 31 OCT 2026",left,670,19,800,C.ink,"DM Mono");
  drawText("GOA, INDIA",left,700,13,600,C.green,"DM Mono");
  drawText("4 DAYS · 1 RHYTHM · BUILD SOMETHING",left,748,12,600,C.muted,"DM Mono");
  // Footer identity.
  drawText("LESS NOISE. MORE SIGNAL.",left,828,13,500,C.muted,"DM Mono");
  drawText("#FRAMEINGOA",left,865,17,800,C.green,"DM Mono");
  ctx.fillStyle=C.pink;ctx.fillRect(right-92,800,92,92);drawText("HH",right-46,860,25,800,C.yellow,"DM Mono","center");
}
function render(){drawCard();downloadBtn.disabled=!generated;shareBtn.disabled=!generated}
async function loadFile(file){if(!file)return;let blob=file;try{if(/\.hei[cf]$/i.test(file.name)||file.type==="image/heic"||file.type==="image/heif"){if(!window.heic2any)throw Error();blob=await window.heic2any({blob:file,toType:"image/jpeg",quality:.9});if(Array.isArray(blob))blob=blob[0]}const url=URL.createObjectURL(blob),img=new Image;img.onload=()=>{sourceImage=img;URL.revokeObjectURL(url);generated=false;render();dropZone.querySelector("strong").textContent="Photo ready ✓"};img.onerror=()=>{URL.revokeObjectURL(url);alert("This image could not be read. Please try JPG or PNG.")};img.src=url}catch(e){alert("HEIC conversion failed. Please try a JPG/PNG image.")}}
photoInput.addEventListener("change",e=>loadFile(e.target.files[0]));["dragenter","dragover"].forEach(t=>dropZone.addEventListener(t,e=>{e.preventDefault();dropZone.style.borderColor=C.pink}));["dragleave","drop"].forEach(t=>dropZone.addEventListener(t,e=>{e.preventDefault();dropZone.style.borderColor=""}));dropZone.addEventListener("drop",e=>loadFile(e.dataTransfer.files[0]));
generateBtn.addEventListener("click",()=>{if(!sourceImage){alert("Upload a photo first.");return}generated=true;render();document.querySelector(".preview-panel").scrollIntoView({behavior:"smooth",block:"center"})});
[nameInput,roleInput,titleInput].forEach(i=>i.addEventListener("input",()=>{if(generated)drawCard()}));
titleInput.addEventListener("change",()=>{if(generated)drawCard()});
downloadBtn.addEventListener("click",()=>{if(!generated)return;const a=document.createElement("a");a.download=`hh-goa-builder-${(nameInput.value||"card").trim().replace(/\s+/g,"-").toLowerCase()}.png`;a.href=canvas.toDataURL("image/png",1);a.click()});
shareBtn.addEventListener("click",async()=>{if(!generated)return;const caption=`Built my Hacker House Goa 2026 Builder ID 🚀\n\n${nameInput.value||"Builder"} · ${roleInput.value||"Builder"}\n${titleInput.value||"Builder"}\n\n#FrameInGoa #HHGoa`;canvas.toBlob(async blob=>{const file=new File([blob],"hh-goa-builder-id.png",{type:"image/png"});if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({title:"HH Goa Builder ID",text:caption,files:[file]});return}catch(_){} }window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}`,"_blank","noopener,noreferrer")},"image/png")});render();
