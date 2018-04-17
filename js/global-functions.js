/*
   Keylistener functions
*/
// Setup
//var keyListener = new window.keypress.Listener();

// check targets object
// keyListener.simple_combo('letter', function(){
//    do a thing
// });

/*
   Reload page after so many seconds, used for development
*/
function reloadPage(seconds){

   function reloadCallback(){
      return function(){
         window.location.reload();
      }
   }
   var millis = seconds * 1000;

   setTimeout(reloadCallback(), millis);

}

function checkSettingsCallback(passedFunction){

   if(settings.fetch == true || settings.fetch == undefined)
      fetchSettings();
   else
      return;
}

/*
   Set the parameters of curved image sets using parent settings
*/
function setImagesCurved(parentEl, setBool){

   // find the set of curved elements
   var curvedSet = parentEl.querySelectorAll('a-curvedimage');

   // create a parameters object based on attribute
   var parameters = {
      heightorig:       parentEl.getAttribute('data-heightorig'),
      widthorig:        parentEl.getAttribute('data-widthorig'),
      radius:           parentEl.getAttribute('data-radius'),
      delta:            parentEl.getAttribute('data-delta').split(' '),
      thetaLength:      parentEl.getAttribute('theta-length'),
      thetaStart:       parentEl.getAttribute('theta-start'),
      scale:            parentEl.getAttribute('data-scale')
   }

   // For each element in the curved set, calculate and set its attributes
   for(var i = 0; i < curvedSet.length; i++){

      var el = curvedSet[i];

      // set the radius
      el.setAttribute('radius', parameters.radius);

      // calculate the height to width ratio
      parameters.heightToWidth = parameters.heightorig / parameters.widthorig;
      // The height should be
      // the arc length (the curved width or circumference length)
      //    c = 2 * pi * r
      //    a percentage of c is the arc length
      //    parameters.thetaLength / 360 degrees is that percentage
      // then multiply by the scalar height to width ratio to get the final height
      parameters.height = parameters.heightToWidth * parameters.radius * (2 * Math.PI * (parameters.thetaLength / 360));
      el.setAttribute('height', parameters.height);

      // set the theta-length
      el.setAttribute('theta-length', parameters.thetaLength);

      // if thetaStart isn't set, set the midpoint of the mockup to be the center
      if(parameters.thetaStart == undefined){
         el.setAttribute('theta-start', (360 - parameters.thetaLength) / 2);

      }else{
         el.setAttribute('theta-start', parameters.thetaStart);
      }

      // if the scale isn't set, give it the attribute ... don't think I need this, but it'd be nice to setup something like this for a default value
      // if(el.getAttribute('scale') == null){
      //    el.setAttribute('scale', parameters.scale);
      // }

      var scale = {
         x: Number(parameters.scale) + Number(parameters.delta[i]),
         y: Number(parameters.scale) + Number(parameters.delta[i]),
         z: Number(parameters.scale) + Number(parameters.delta[i])
      }

      el.setAttribute('scale', scale);

   }
}

/*
   Sets the straight/planar images based on a given height and width
*/
function setImagesStraight(){

   var straightImages = scene.querySelectorAll('a-image.js-set');
   forEach(straightImages, function(el){
      var straightWidthOriginal = el.getAttribute('data-width');
      var straightHeightOriginal = el.getAttribute('data-height');
      var straightDesiredHeight = el.getAttribute('height');

      var width = straightDesiredHeight * straightWidthOriginal / straightHeightOriginal;
      console.log(width);
      el.setAttribute('width', width);
   });
}

/*
   Replacement of for() loops over arrays
*/
function forEach(array, action) {
   for (var i = 0; i < array.length; i++)
      action(array[i]);
}

/*
   Toggle to a target. Works by setting all targets below the ground plane, then pulling up the active one
*/
function toggleTargetTo(toggleTo){

   if(targets.els == undefined){
      console.error('target.els is undefined');
   }
   if(settings.hiddenPosition == undefined){
      console.error('settings.hiddenPosition is undefined');
   }

   // For each target, set the position below the ground plane
   forEach(targets.els, function(el){
      el.setAttribute('position', settings.hiddenPosition.x + ' ' + settings.hiddenPosition.y + ' ' + settings.hiddenPosition.z);
   });

   // Create a var with the initial position of the specific target
   var pos = targets[toggleTo].initPosition;

   // Find the toggleTo and actually set the position attribute
   scene.querySelector('#' + toggleTo).setAttribute('position', pos.x + ' ' + pos.y + ' ' + pos.z);

   // Change the active target to the toggleTo
   targets.active = toggleTo;

}

/*
   Builds the targets{} by looping through ids
*/
function buildTargets(targets){

   // Loop it
   for(i = 1; i < targets.els.length + 1; i++){
      var targetName = 'target' + i;
      targets[targetName] = {
         el: scene.querySelector('#' + targetName),
         initPosition: scene.querySelector('#' + targetName).getAttribute('position')
      };
   }

   // Return the object
   return targets;
}

function devTools(){
   if(settings.enterVR == true){
      scene.enterVR();
   }
   // If the reload setting is turned on, enterVR and reload the page after a set time
   if(settings.reload == true){
      reloadPage(settings.reloadTime);
   }
}

function buildCameras(cameras, options){

   // Loop it to build {}
   for(i = 0; i < cameras.els.length; i++){
      var camera = cameras.els[i];
      var cameraName = camera.getAttribute('id');
      var cameraPrefix = '';
      if(options.strip != undefined && options.strip == true){
         var cameraNameNew = cameraName.replace(/camera-/, '');
         cameraName = cameraNameNew;
         cameraPrefix = 'camera-';
      }
      var cameraId = '#' + cameraPrefix + cameraName;
      var cameraEl = scene.querySelector(cameraId)

      // Create the camera object entry
      cameras[cameraName] = {
         el: cameraEl,
         id: cameraId
      }

   }

   // Return the object
   return cameras;
}

function toggleCameraTo(targetCamera){

   if(cameras.active != undefined){
      activeCamera = cameras.active;
   }else if(settings.camera != undefined){
      activeCamera = settings.camera;
   }else{
      return;
   }


   // Deactivate active camera
   scene.querySelector('#' + activeCamera).setAttribute('active', false);

   // Activate target camera
   scene.querySelector('#' + targetCamera).setAttribute('active', true);

   // Set new active camera
   cameras.active = targetCamera;
}

function setCameraHeight(camera, height){
   var cameraPosition = camera.getAttribute('position');
   cameraPosition.y = height;
   camera.setAttribute('position', cameraPosition);
}

function setCamera(camera, position){
   camera.setAttribute('position', position);
}
