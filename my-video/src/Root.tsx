import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { OFlockPromo, oflockSchema } from "./OFlockPromo";
import { OFlockPromoV2, oflockPromoV2Schema } from "./OFlockPromoV2";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* O'Flock Promotional Video V2 - Sleek Minimal Promo */}
      <Composition
        id="OFlockPromoV2"
        component={OFlockPromoV2}
        durationInFrames={660}
        fps={30}
        width={1920}
        height={1080}
        schema={oflockPromoV2Schema}
        defaultProps={{
          title: "O'Flock",
          tagline: "Your Psychological AI Co-Founder",
        }}
      />

      {/* O'Flock Promotional Video (Original) */}
      <Composition
        id="OFlockPromo"
        component={OFlockPromo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        schema={oflockSchema}
        defaultProps={{
          title: "O'flock",
          tagline: "Your daily clarity companion",
        }}
      />

      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        schema={myCompSchema}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema2}
        defaultProps={{
          logoColor1: "#91dAE2" as const,
          logoColor2: "#86A8E7" as const,
        }}
      />
    </>
  );
};
