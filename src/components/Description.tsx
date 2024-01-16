import { OverlayTriggerState } from 'react-stately';

interface DescriptionProps {
  state: OverlayTriggerState;
}
const Description = (props: DescriptionProps) => {
  const state = props.state;
  return (
    <div className="pb-40">
      <div className="pb-40 text-[32px] text-[--charcoal-brand] font-bold text-center">
        bvh to VRMA
      </div>
      <div className="text-center text-[14px] sm:text-[16px] pb-[6px]">
        あなたのbvhファイルをVRMAファイルに変換します。
      </div>
      <div className="text-center typography-14 sm:typography-16">
        サービスを利用する前に、
        <button
          className="text-link1"
          onClick={() => {
            state.open();
          }}
        >
          利用上の注意
        </button>
        をご確認ください。
      </div>
    </div>
  );
};
export default Description;
