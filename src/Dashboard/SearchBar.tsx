export default function AnimatedMail() {
  return (
    <>
      <style>{`
        .letter-image:hover .animated-mail {
          transform: translateY(50px);
        }
        .letter-image:hover .top-fold {
          transform: rotateX(180deg);
          transition: transform .4s, z-index .2s;
          z-index: 0;
        }
        .letter-image:hover .letter {
          height: 180px;
        }
        .letter-image:hover .shadow {
          width: 250px;
        }
        .top-fold {
          transition: transform .4s .4s, z-index .2s .4s;
        }
        .letter {
          transition: height .4s .2s;
        }
        .animated-mail {
          transition: transform .4s;
        }
        .shadow {
          transition: width .4s;
        }
        .letter-border {
          background: repeating-linear-gradient(
            -45deg,
            #7c3aed,
            #7c3aed 8px,
            transparent 8px,
            transparent 18px
          );
        }
      `}</style>

      <div className="relative w-[200px] h-[200px] cursor-pointer letter-image">

        {/* Animated mail wrapper */}
        <div className="animated-mail absolute w-[200px] h-[150px]">

          {/* Back fold */}
          <div className="absolute bottom-0 w-[200px] h-[100px] bg-[#6d28d9] z-0" />

          {/* Letter */}
          <div className="letter absolute left-[20px] bottom-0 w-[160px] h-[60px] bg-white z-[1] overflow-hidden">
            <div className="letter-border h-[10px] w-full" />
            <div className="mt-[10px] ml-[5px] h-[10px] w-[40%] bg-[#7c3aed]" />
            <div className="mt-[10px] ml-[5px] h-[10px] w-[20%] bg-[#7c3aed]" />
            <div className="mt-[30px] ml-[120px] rounded-full h-[30px] w-[30px] bg-[#7c3aed] opacity-30" />
          </div>

          {/* Top fold */}
          <div
            className="top-fold absolute z-[2]"
            style={{
              top: "50px",
              width: 0,
              height: 0,
              borderStyle: "solid",
              borderWidth: "50px 100px 0 100px",
              borderColor: "#6d28d9 transparent transparent transparent",
              transformOrigin: "50% 0%",
            }}
          />

          {/* Body */}
          <div
            className="absolute bottom-0 z-[2]"
            style={{
              width: 0,
              height: 0,
              borderStyle: "solid",
              borderWidth: "0 0 100px 200px",
              borderColor: "transparent transparent #a855f7 transparent",
            }}
          />

          {/* Left fold */}
          <div
            className="absolute bottom-0 z-[2]"
            style={{
              width: 0,
              height: 0,
              borderStyle: "solid",
              borderWidth: "50px 0 50px 100px",
              borderColor: "transparent transparent transparent #8b5cf6",
            }}
          />
        </div>

        {/* Shadow */}
        <div
          className="shadow absolute left-1/2 -translate-x-1/2 w-[400px] h-[30px] rounded-full"
          style={{
            top: "200px",
            background: "radial-gradient(rgba(109,40,217,0.4), rgba(0,0,0,0.0), rgba(0,0,0,0.0))",
          }}
        />
      </div>
    </>
  );
}