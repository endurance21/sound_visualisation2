const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
if(window.innerWidth<300)
controls.font_size = '8vw' ;
else
controls.font_size = '6vw' ;
ctx.font = ''+ controls.font_size+' Cinzel, serif';
ctx.fillStyle = 'rgba(255,255,255,0.5)';
ctx.textAlign = "center";
ctx.fillText(txt, canvas.width/2, canvas.height/2); 

function start(){
audioctx = new AudioContext();
source = audioctx.createMediaElementSource(audio); 
analyser = audioctx.createAnalyser();
source.disconnect();
source.connect(analyser);
analyser.fftSize =512;
analyser.connect(audioctx.destination);
bufferLength = analyser.frequencyBinCount;
time_domain_data = new Uint8Array(bufferLength);
frequency_domain_data = new Uint8Array(bufferLength);
angular_width = Math.PI*2/(bufferLength);

function animate(){
    if(controls.is_audio_playing){
      audio.play();
    }
    else 
    audio.pause();

    ctx.beginPath();
    animationref = requestAnimationFrame(animate) ;
    ctx.clearRect(0,0,innerWidth,innerHeight);    

    analyser.getByteTimeDomainData(time_domain_data);  
    analyser.getByteFrequencyData(frequency_domain_data);

    Radius = controls.Radius + (time_domain_data[bufferLength-2])*controls.intensity;
    time++;    

    if(controls.is_circle){
      if(time_domain_data[30]/3 > 49){
      bass_radius = time_domain_data[10]*7/3;
      ctx.arc(innerWidth/2, innerHeight/2, bass_radius*1.5, 0 , Math.PI*2 ,0 );
      }

      else {
      bass_radius =time_domain_data[10]/3 ; 
      ctx.arc(innerWidth/2, innerHeight/2, bass_radius, 0 , Math.PI*2 ,0 );
      }
      ctx.strokeStyle = 'rgba(1,230,90,0.4)';
   ctx.stroke();
   ctx.closePath();
    }
    radius1 = Radius/2.5 ;
    radius2 = Radius/1.2;
    radius3 = Radius;
    omega1 = Math.sin(time*controls.frequency*2);
    omega2 = Math.sin(time*controls.frequency + Math.PI);
    omega3 = Math.sin(time*controls.frequency + Math.PI/2);
    for(var i = 1;i < bufferLength; i++){
        angle = i*(angular_width)*controls.separation; 
        angle2 = i*(angular_width)*controls.side_length ;
        if(angle>2*radian && angle<Math.PI/2-2*radian || angle>Math.PI/2+2*radian&&angle<Math.PI-2*radian||angle>Math.PI+2*radian&&angle<Math.PI*3/2-2*radian||angle>Math.PI*3/2+2*radian&&angle<Math.PI*2-2*radian){
          draw_bars(ctx,angle+omega2,-10,radius1); 
          draw_bars(ctx,angle+omega3,+10,radius2); 
         }
       draw_polygon(ctx,center,controls.sides,Radius + frequency_domain_data[100]/5,omega1); 
      }

}
animate();
}

function draw_bars(ctx, angle,height,Radius){
  ctx.translate(innerWidth/2, innerHeight/2);
  ctx.moveTo(0, 0);
  ctx.lineWidth = 3;
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0,-Radius);
  ctx.lineTo(0,-(Radius+height));
  ctx.moveTo(0,0);
  ctx.strokeStyle =  controls.color
  ctx.stroke();
  ctx.closePath();
  ctx.rotate(-angle);
  ctx.translate(-innerWidth/2, -innerHeight/2);
}

function draw_polygon(ctx, center, sides, radius, omega){
  let angular_width = Math.PI*2/sides;
  ctx.beginPath();
  for(let i = 0; i<sides; i++){
    ctx.moveTo(move_point(center,i,radius,angular_width,omega).x,move_point(center,i,radius,angular_width,omega).y);
    ctx.lineTo(move_point(center,i+1,radius,angular_width,omega).x,move_point(center,i+1,radius,angular_width,omega).y);
  }
  ctx.closePath();
  ctx.lineWidth = 1;
//  ctx.shadowColor='blue';
// ctx.shadowOffsetX=0;
// ctx.shadowOffsetY=0;
// ctx.shadowBlur=25;
  ctx.strokeStyle = 'cyan';
  ctx.stroke();
  
}


function move_point(center,index,radius,angular_width,omega){
  let angle = index*angular_width;
  return position = {x:center.x + (radius)*Math.cos(angle+omega),y:center.y + (radius)*Math.sin(angle+omega) };
}

