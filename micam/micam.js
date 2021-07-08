var video = document.querySelector('#video');
var overlay = document.querySelector('#overlay');
var overlayCC = overlay.getContext('2d');

var infoview = document.querySelector('#infoview');
var infoCC = infoview.getContext('2d');

//var audio_Foucs = document.getElementById("SE_Fouse");
//var audio_Ready = document.getElementById("SE_Ready");

var image = document.querySelector('#snap');
var take_photo_btn = document.querySelector('#take-photo');
var delete_photo_btn = document.querySelector('#delete-photo');
var download_photo_btn = document.querySelector('#download-photo');
var cscore = 0 ;
var score = 0 ;


var constraints = {
  audio: false,
  video: {
    // スマホのバックカメラを使用
    facingMode: 'user' ,
    width: {min: 1280}, 
    height: {min: 720}
  }
};

function adjustVideo() {

  // 映像が画面幅いっぱいに表示されるように調整
  var ratio = window.innerWidth / video.videoWidth;

  video.width = window.innerWidth;
  video.height = video.videoHeight * ratio;

  infoview.width = window.innerWidth;
  infoview.height = window.innerHeight;

  overlay.width = video.width;
  overlay.height = video.height;

}
 
 

//スナップショットを撮る
function takeSnapshot(video) {

    // 出力先カンバス
    var resizedCanvas = document.createElement("canvas");
    var resizedContext = resizedCanvas.getContext("2d");
    var width = video.videoWidth ;
    var height = video.videoHeight ;

//    var aScene = document.querySelector('#snap').components.screenshot.getCanvas("perspective");
    var aScene = document.querySelector('#snap') ;

    console.log( "w:" + width +  "h:" + height );


    if (width && height) {

        //videoのサイズをキャンバスにセット
        resizedCanvas.width = width;
        resizedCanvas.height = height;
        //キャンバスにvideoをコピー
        resizedContext.translate( width , 0 );
        resizedContext.scale( -1, 1 );
        resizedContext.drawImage( video , 0 , 0 , width, height);
        resizedContext.drawImage( overlay , 0 , 0 , width, height);

       //カメラの画角でar側の縮小処理を変える
       if (width > height) {
           // 横長（PC)
           resizedContext.drawImage(aScene, 0, 0, width, height);
       } else {
           // 縦長（スマホ）
                var scale = height / width;
                var scaledWidth = height * scale;
                var marginLeft = (width - scaledWidth) / 2;

            resizedContext.drawImage(aScene, marginLeft, 0, scaledWidth, height);
            resizedContext.drawImage(aScene, 0, 0, width, height);
        }

        return resizedCanvas.toDataURL('image/png');
    }
}


  infoview.width = window.innerWidth;
  infoview.height = window.innerHeight;
  infoCC.font = "12px";
  infoCC.fillStyle = "black" ;
  infoCC.fillText( window.navigator.appVersion , 3 , infoview.height - 3   ) ;

  track.init(pModel);


    //スナップショットボタン
    take_photo_btn.addEventListener("click", function (e) {
        e.preventDefault();
        var video = document.querySelector('video');
        var snap = takeSnapshot(video);

        //スナップショット表示.
        image.setAttribute('src', snap);
        image.classList.add('visible');

        // 削除ボタンと保存ボタン有効
        delete_photo_btn.classList.remove("disabled");
        download_photo_btn.classList.remove("disabled");

        // 保存ボタンにスナップショットを渡す
        download_photo_btn.href = snap;
    } );

    //削除ボタン
    delete_photo_btn.addEventListener("click", function(e){

        e.preventDefault();

        // スナップショットを隠す
        image.setAttribute('src', "");
        image.classList.remove("visible");

        // 削除ボタンと保存ボタン無効
        delete_photo_btn.classList.add("disabled");
        download_photo_btn.classList.add("disabled");

    } );


  window.addEventListener( "resize", function () {
//    adjustVideo();
  });

  // カメラから映像を取得
  navigator.mediaDevices.getUserMedia(constraints)
  .then((stream) => {
    video.srcObject = stream;
    // 動画のメタ情報のロードが完了したら実行
    video.onloadedmetadata = function() {
      adjustVideo();
      startTracking();
    };
  })

  .catch((err) => {
    window.alert(err.name + ': ' + err.message);
  });


