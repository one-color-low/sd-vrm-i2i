https://github.com/one-color-low/sd-vrm-i2i/assets/39424535/312063dc-ea15-44c3-a150-a8634c6e9560

# Description
VRMの3DモデルからStable Diffusionのimage2imageを実行するアプリです。

VRMビューアーには [bvh2vrma](https://github.com/vrm-c/bvh2vrma) 様を使用させていただいております。

また、[Stable Diffusion WebUI](https://github.com/AUTOMATIC1111/stable-diffusion-webui) のAPIモードを使用します。

# Preparation
## UIの準備
1. `git clone https://github.com/one-color-low/sd-vrm-i2i.git`
2. `yarn install && yarn dev`
3. http://localhost:3000 にアクセスします。

## Stable Diffusionの準備
1. [Stable Diffusion WebUI](https://github.com/AUTOMATIC1111/stable-diffusion-webui)の「Installation and Running」に従ってWebUIが使える状態にします。
2. WebUIがAPIモードで起動するように、`webui-xxxx-env.sh`の`export COMMANDLINE_ARGS`に`--cors-allow-origins http://localhost:3000 --api`を追加します。
3. `webui-xxxx-env.sh`を実行します。

## image2imageの実行
1. UIの画面左側からbvhファイル(モーションファイル)を読み込みます。
    - bvhファイルは[こちら](http://motion.hahasoha.net/)などから入手できます。
2. 3Dモデルのアニメーションが表示されるので、任意のポーズで停止させ、お好きな画角に収めます。
3. 「Capture」ボタンをクリックします。画面右側にキャプチャ結果が表示されます。
3. プロンプトに任意の呪文を入力します。(こちらはpositiveです)
4. 「Capture Diffusion」ボタンをクリックします。数秒後、image2image結果が画面右側に表示されれば成功です！
