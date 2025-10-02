'use client';

import { Canvas, useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

export default function Model({ name }: { name: string }) {
    const mtlUrl = '/swanwoo_pedals_obj/' + name + '/usdz.mtl';
    const objUrl = '/swanwoo_pedals_obj/' + name + '/usdz.obj';

    const materials = useLoader(MTLLoader, mtlUrl);
    const result = useLoader(OBJLoader, objUrl, (loader) => {
        materials.preload();
        loader.setMaterials(materials);
    });

    console.log(name + ' load model', result);
    return <primitive object={result} scale={[10, 10, 10]} position={[0, 0, 0]} />;
}
