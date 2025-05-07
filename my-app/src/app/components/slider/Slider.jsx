import { Slider } from "@heroui/slider";

const ModalSlider = () => {
    return (     
        <Slider
        className="text-gray-900"
        defaultValue={3}
        label="Questions"
        maxValue={10}
        minValue={1}
        step={1}
      />
    );
}

export default ModalSlider;