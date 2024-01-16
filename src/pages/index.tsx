import LoadBVH from '@/components/LoadBVH';
import Description from '@/components/Description';
import Modal from '@/components/Modal';
import VrmViewer from '@/components/VrmViewer';
import { useState, useCallback, useRef } from 'react';
import { Button, TextArea, Icon } from '@charcoal-ui/react';

interface ChildComponentMethods {
  captureCanvas: () => string;
}

export default function Home() {
  const [blobURL, setBlobURL] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const childRef = useRef<ChildComponentMethods | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  function dataURLtoBlob(dataurl: string) {
    return fetch(dataurl).then(res => res.blob());
  }
  function blobToFile(blob: Blob, fileName: string) {
    return new File([blob], fileName, { type: blob.type });
  }

  function downloadImage(imageDataUrl: string, fileName: string) {
    dataURLtoBlob(imageDataUrl).then(blob => {
      const file = blobToFile(blob, fileName);

      // ダウンロードリンクを作成してクリックする
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // 後処理
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    });
  }

  const handleCapture = () => {
    if (childRef.current) {
      const imageDataUrl = childRef.current.captureCanvas();
      setImageSrc(imageDataUrl)
      // downloadImage(imageDataUrl, "canvas.png")
    }
  };

  const handleDiffusion = () => {
    console.log("diffusion")

    var user_prompt = "";
    if (textAreaRef.current) {
      user_prompt = textAreaRef.current.value;
    }

    const imgSetting = {
      "prompt": "(masterpiece:1.1),(best quality:1.0),(super fine cel anime:1.2),no background,flat background, " + user_prompt,
      "negative_prompt": "(worst quality, low quality:1.2),ugly,error,lowres,blurry,multipul angle, split view, grid view,text,signature,watermark,bad anatomy",
      "steps": 20,
      "sampler_index": "DPM++ 2M Karras",
      "width": 256,
      "height": 384,
      "cfg_scale": 7,
      "seed": -1,
    };

    // APIへのPOSTリクエスト
    fetch('http://localhost:7860/sdapi/v1/txt2img', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(imgSetting),
    })
      .then(response => response.json())
      .then(data => {

        const imgData = data.images[0];

        // 画像のメディアタイプを指定（例: 'image/png'）
        const mediaType = 'image/png';

        // Base64エンコードされたデータをデータURLに変換
        const imageDataUrl = `data:${mediaType};base64,${imgData}`;

        // 状態に画像URLをセット
        setImageSrc(imageDataUrl);

      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });

  };

  const handleCaptureDiffusion = async () => {

    // changeCheckpoint();

    console.log("capture diffusion")

    var user_prompt = "";
    if (textAreaRef.current) {
      user_prompt = textAreaRef.current.value;
    }

    if (imageSrc) {
      // Base64エンコードされたデータ部分のみを抽出
      const base64Image = imageSrc.split(',')[1];

      // APIリクエストのペイロードを作成
      const payload = {
        "init_images": [base64Image],
        "prompt": "(masterpiece:1.1),(best quality:1.0),no background,flat background, " + user_prompt,
        "negative_prompt": "(worst quality, low quality:1.2),ugly,error,lowres,blurry,multipul angle, split view, grid view,text,signature,watermark,bad anatomy",
        "steps": 30,
        "denoising_strength":0.65
      };

      try {
        // fetchを使ってPOSTリクエストを送信
        const response = await fetch(`http://localhost:7860/sdapi/v1/img2img`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // レスポンスのJSONを取得
        const data = await response.json();

        // 必要な処理（例: 新しい画像データの取得など）
        console.log(data);

        const imgData = data.images[0];

        // 画像のメディアタイプを指定（例: 'image/png'）
        const mediaType = 'image/png';

        // Base64エンコードされたデータをデータURLに変換
        const imageDataUrl = `data:${mediaType};base64,${imgData}`;

        // 状態に画像URLをセット
        setImageSrc(imageDataUrl);

      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    } else {
      console.log("base image not found")
    }


  };

  const handleChangeCheckpoint = () => {
    const model = "realcartoon3d_v11.safetensors [408a4d0253]"

    const payload = {
      "sd_model_checkpoint": model,
    };

    fetch('http://localhost:7860/sdapi/v1/options', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });

  }

  return (
    <main className="">

      <div className="flex">

        <div className="flex-1 p-4 border">
          <p className="p-4">Left Panel</p>
          <div className="rounded-24 justify-center">
            {blobURL ? (
              <>
                <div className="max-lg:py-24 flex justify-center">
                  <VrmViewer blobURL={blobURL} ref={childRef} />
                </div>
              </>
            ) : (
              <>
                <div className="">
                  <div className="flex justify-center">
                    <div className="lg:w-[600px] lg:h-[296px] h-[268px] w-[358px] sm:w-[60vw]">
                      <LoadBVH setBlobURL={setBlobURL} />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="p-4 border justify-center">
          <p className="p-4">Center Panel</p>
          <br></br><br></br><br></br><br></br><br></br>
          <Icon name="32/Next" scale={3} className='justify-center flex' />
          <div className="bg-red-100"></div>
        </div>

        <div className="flex-1 p-4 border">
          <p className="p-4">Right Panel</p>
          <div className="justify-center">
            {imageSrc && <img src={imageSrc} alt="Captured" width="400" />}
          </div>
          <div className="w-full bg-white-500"></div>
        </div>

      </div>

      <div className='flex flex-col justify-center items-center'>
        <p className="p-4">Bottom Panel</p>

        <br></br>

        <TextArea ref={textAreaRef} label='prompt' rows={5} className='w-[500px]'></TextArea>

        <br></br>

        <Button onClick={handleCapture} variant="Primary">
          Capture
        </Button>
        {/* <Button onClick={handleDiffusion} variant='Primary'>
          Diffusion
        </Button> */}
        <br></br>
        <Button onClick={handleCaptureDiffusion} variant='Primary'>
          Capture Diffusion
        </Button>
        <br></br>
        {/* <Button onClick={handleChangeCheckpoint} variant='Primary'>
          Change Model
        </Button> */}

      </div>

    </main>
  );
}