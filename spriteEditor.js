/**
 * Created by Anubhav Gupta on 8/12/2015.
 */
document.addEventListener('DOMContentLoaded', function () {

    var $cols = document.getElementById("cols");
    var $rows = document.getElementById("rows");
    var $file = document.getElementById("fileSelector");
    var $skipFrames = document.getElementById("skipFrames");
    var $marginTop = document.getElementById("marginTop");
    var $marginRight = document.getElementById("marginRight");
    var $marginBottom = document.getElementById("marginBottom");
    var $marginLeft = document.getElementById("marginLeft");
    var $generate = document.getElementById("generate");
    var $canvas = document.getElementById("canvas");
    var context = $canvas.getContext("2d");
    var $newCols = document.getElementById("newCols");
    var $newRows = document.getElementById("newRows");
    var $reverse = document.getElementById("reverse");
    var $canvasGenerated = document.getElementById("generated");
    var contextGenerated = $canvasGenerated.getContext("2d");
    var originalImage = new Image();
    originalImage.onload = draw;

    function changeHandler() {
        draw(
            $cols.value,
            $rows.value,
            $skipFrames.value,
            $marginTop.value,
            $marginRight.value,
            $marginBottom.value,
            $marginLeft.value
        );
    }

    $cols.addEventListener("change", changeHandler);
    $rows.addEventListener("change", changeHandler);
    $skipFrames.addEventListener("change", changeHandler);
    $marginTop.addEventListener("change", changeHandler);
    $marginRight.addEventListener("change", changeHandler);
    $marginBottom.addEventListener("change", changeHandler);
    $marginLeft.addEventListener("change", changeHandler);
    $generate.addEventListener('click',generateIt);

    function generateIt(){
        generate(
            $skipFrames.value,
            $marginTop.value,
            $marginRight.value,
            $marginBottom.value,
            $marginLeft.value,
            $cols.value,
            $rows.value,
            originalImage.naturalWidth,
            originalImage.naturalHeight
        );
    }

    $file.addEventListener('change', function (e) {
        var x = new FileReader();
        x.readAsDataURL(e.target.files[0]);
        x.onload = function (e) {
            originalImage.src = e.target.result;
        };
    });


    function draw(cols, rows, framesToSkip, mTop, mRight, mBottom, mLeft) {
        $canvas.setAttribute('width', originalImage.naturalWidth);
        $canvas.setAttribute('height', originalImage.naturalHeight);
        context.clearRect(0, 0, originalImage.naturalWidth, originalImage.naturalHeight);
        context.drawImage(originalImage, 0, 0, originalImage.naturalWidth, originalImage.naturalHeight);
        if (cols && rows) {
            drawSections(cols, rows, originalImage.naturalWidth, originalImage.naturalHeight);
        }
        if (framesToSkip) {
            skipFrames(framesToSkip, cols, rows, originalImage.naturalWidth, originalImage.naturalHeight);
        }
        if (mTop || mRight || mBottom || mLeft) {
            drawMargins(mTop, mRight, mBottom, mLeft, cols, rows, originalImage.naturalWidth, originalImage.naturalHeight);
        }
    }

    function drawSections(cols, rows, width, height) {
        context.lineWidth = 2;
        context.strokeStyle = 'black';
        var cellWidth = width / cols;
        var cellHeight = height / rows;
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                context.beginPath();
                context.rect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
                context.stroke();
                context.closePath();
            }
        }
    }

    function skipFrames(frames, cols, rows, width, height) {
        var list = frames.split(",");
        list.forEach(function (item, index, arr) {
            arr[index] = parseInt(item);
        });
        context.lineWidth = 2;
        context.strokeStyle = 'black';
        context.fillStyle = 'rgba(0,0,0,0.8)';
        var cellWidth = width / cols;
        var cellHeight = height / rows;
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                if (~list.indexOf((i * cols) + j)) {
                    context.beginPath();
                    context.rect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
                    context.stroke();
                    context.fill();
                    context.closePath();
                }

            }
        }
    }

    function drawMargins(top, right, bottom, left, cols, rows, width, height) {
        var cellWidth = width / cols;
        var cellHeight = height / rows;

        context.strokeStyle = 'black';
        context.fillStyle = 'rgba(255,0,0,0.5)';

        top = +top || 0;
        bottom = +bottom || 0;
        left = +left || 0;
        right = +right || 0;

        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                if (top) {
                    context.beginPath();
                    context.rect(j * cellWidth, i * cellHeight, cellWidth, top);
                    context.fill();
                    context.closePath();
                }
                if (bottom) {
                    context.beginPath();
                    context.rect(j * cellWidth, ((i + 1) * cellHeight) - bottom, cellWidth, bottom);
                    context.fill();
                    context.closePath();
                }
                if (left) {
                    context.beginPath();
                    context.rect(j * cellWidth, i * cellHeight, left, cellHeight);
                    context.fill();
                    context.closePath();
                }
                if (right) {
                    context.beginPath();
                    context.rect(((j + 1) * cellWidth) - right, i * cellHeight, right, cellHeight);
                    context.fill();
                    context.closePath();
                }

            }
        }

    }

    function generate(framesToSkip, top, right, bottom, left, cols, rows, width, height) {

        context.clearRect(0,0,originalImage.naturalWidth, originalImage.naturalHeight);
        context.drawImage(originalImage, 0, 0, originalImage.naturalWidth, originalImage.naturalHeight);

        top = +top || 0;
        bottom = +bottom || 0;
        left = +left || 0;
        right = +right || 0;
        cols = +cols||0;
        rows= +rows||0;
        var newCols = parseInt($newCols.value);
        var newRows = parseInt($newRows.value);
        var list = framesToSkip.split(",");
        list.forEach(function (item, index, arr) {
            arr[index] = parseInt(item);
        });

        var cellWidth = width / cols;
        var cellHeight = height / rows;
        var newCellWidth = cellWidth - (left + right);
        var newCellHeight = cellHeight - (top + bottom);

        $canvasGenerated.setAttribute('width',newCols * newCellWidth);
        $canvasGenerated.setAttribute('height',newRows * newCellHeight);
        contextGenerated.clearRect(0, 0, originalImage.naturalWidth, originalImage.naturalHeight);


        var imgFrames = [];
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                if (!~list.indexOf((i * cols) + j)) {
                    var imgData = context.getImageData(
                        (j * cellWidth) + left,
                        (i * cellHeight) + top,
                        newCellWidth,
                        newCellHeight
                    );
                    imgFrames.push(imgData);
                }
                else{
                    console.log("skipping:row,col->",i,j);
                }
            }
        }

        if($reverse.checked){
            for(var i=newRows- 1,k=0; i>=0,k<newRows;i--,k++){
                for(var j=newCols- 1,l=0;j>=0,l<newCols;j--,l++){
                    contextGenerated.putImageData(imgFrames[(i*newCols)+j],l*newCellWidth,k*newCellHeight);
                }
            }
        }
        else{
            for(var i=0;i<newRows;i++){
                for(var j=0;j<newCols;j++){
                    contextGenerated.putImageData(imgFrames[(i*newCols)+j],j*newCellWidth,i*newCellHeight);
                }
            }
        }



    }

});
