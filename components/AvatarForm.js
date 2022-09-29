import BigHeadData from "../BigHeadConfig";

const AvatarFormLayer = ({ name, options, layerConfig, setlayerConfig }) => {
  return (
    <div className="border-b border-green-300">
      <h3 className="text-slate-500 text-sm font-semibold mb-2">{name}</h3>
      <div className="grid items-center gap-3 grid-cols-4 md:grid-cols-6">
        {options.map((opt, i) => (
          <p
            onClick={() => setlayerConfig({ ...layerConfig, [name]: opt })}
            className={`text-xs font-medium cursor-pointer ${
              layerConfig[name] === opt && "text-green-500"
            } rounded-lg py-1`}
            key={name + "_" + opt}
          >
            {opt}
          </p>
        ))}
      </div>
    </div>
  );
};

const AvatarForm = ({ isOpen, layerConfig, setlayerConfig }) => {
  return (
    <div className={`space-y-4 ${!isOpen && "hidden"}`}>
      <AvatarFormLayer
        layerConfig={layerConfig}
        setlayerConfig={setlayerConfig}
        name="accessory"
        options={BigHeadData.accessory}
      />
      <AvatarFormLayer
        layerConfig={layerConfig}
        setlayerConfig={setlayerConfig}
        name="body"
        options={BigHeadData.body}
      />
      <AvatarFormLayer
        layerConfig={layerConfig}
        setlayerConfig={setlayerConfig}
        name="clothing"
        options={BigHeadData.clothing}
      />
      <AvatarFormLayer
        layerConfig={layerConfig}
        setlayerConfig={setlayerConfig}
        name="eyebrows"
        options={BigHeadData.eyebrows}
      />
      <AvatarFormLayer
        layerConfig={layerConfig}
        setlayerConfig={setlayerConfig}
        name="eyes"
        options={BigHeadData.eyes}
      />
      <AvatarFormLayer
        layerConfig={layerConfig}
        setlayerConfig={setlayerConfig}
        name="facialHair"
        options={BigHeadData.facialHair}
      />
      <AvatarFormLayer
        layerConfig={layerConfig}
        setlayerConfig={setlayerConfig}
        name="hair"
        options={BigHeadData.hair}
      />
      <AvatarFormLayer
        layerConfig={layerConfig}
        setlayerConfig={setlayerConfig}
        name="hairColor"
        options={BigHeadData.hairColor}
      />
      <AvatarFormLayer
        layerConfig={layerConfig}
        setlayerConfig={setlayerConfig}
        name="hat"
        options={BigHeadData.hat}
      />
      <AvatarFormLayer
        layerConfig={layerConfig}
        setlayerConfig={setlayerConfig}
        name="hatColor"
        options={BigHeadData.hatColor}
      />
      <AvatarFormLayer
        layerConfig={layerConfig}
        setlayerConfig={setlayerConfig}
        name="lashes"
        options={BigHeadData.lashes}
      />
      <AvatarFormLayer
        layerConfig={layerConfig}
        setlayerConfig={setlayerConfig}
        name="lipColor"
        options={BigHeadData.lipColor}
      />
      <AvatarFormLayer
        layerConfig={layerConfig}
        setlayerConfig={setlayerConfig}
        name="mouth"
        options={BigHeadData.mouth}
      />
      <AvatarFormLayer
        layerConfig={layerConfig}
        setlayerConfig={setlayerConfig}
        name="skinTone"
        options={BigHeadData.skinTone}
      />
    </div>
  );
};

export default AvatarForm;
