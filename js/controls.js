var audio,Radius,radius1,radius2,radius3,angle,angle2,omega1,omega2,omega3,time = 0,bass_radius,frequency = 0.005,radian = Math.PI/180 ,audioctx,source,analyser,bufferLength,time_domain_data,frequency_domain_data;
var audioLoader;
var is_it_first_time = true;
var controlFolder;
var colorFolder ;
var gui;
const center = {x:innerWidth/2,y:innerHeight/2};
var txt = "PLAY THEN !!" ;
var animationref = null ;
var audios = ['audio_test','audio_test2','audio_test3','audio_test4','audio_test5','audio_test6'];
var controls = {
    current_audio:'audio_test2',
    is_audio_playing:false,
    intensity:.02,
    auto_play:true,
    Radius:250,
    separation:2.7,
    frequency:0.005,
    font_size:'8vw',
    is_circle:true,
    vibrate:true,
    color: "rgb(230,148, 1)",
    sides:3
  
  }
audioLoader = new AudioLoader();
audio = audioLoader.load('assets/audio/'+  controls.current_audio+'.mp3');

gui = new dat.GUI({ height:500});
controlFolder = gui.addFolder('CONTROLS_BASIC');
colorFolder  = gui.addFolder('STROKE_COLOR');

controlFolder.add(controls, 'is_audio_playing').name('PLAY/PAUSE').listen().onChange(()=>{ if(controls.is_audio_playing){ start()}});
controlFolder.add(controls, 'current_audio',audios).name('PLAYLIST').onChange(()=>{ audio.pause(); 
  cancelAnimationFrame(animationref);  
  audio = audioLoader.load('assets/audio/'+  controls.current_audio+'.mp3');
  controls.is_audio_playing = false;
  ctx.clearRect(0,0,innerWidth,innerHeight);
  ctx.font = ''+ controls.font_size+' Cinzel, serif';
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.textAlign = "center";
  ctx.fillText(txt, canvas.width/2, canvas.height/2); 
}
);
controlFolder.add(controls,'Radius',10,250).name('RADIUS').onChange(()=>{});
controlFolder.add(controls,'is_circle').name('CIRCLE').onChange(()=>{});
controlFolder.add(controls,'sides',3,20,1).name('GEOMETRY').onChange(()=>{controls.is_it_first_time = true;});
// controlFolder.add(controls,'frequency',0.005,0.009).listen();
controlFolder.open();  

colorFolder.addColor( controls, 'color' );
colorFolder.open();