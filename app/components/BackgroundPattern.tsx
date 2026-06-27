export default function BackgroundPattern() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" style={{ backgroundColor: "#eae8e7" }}>
      <div
        className="absolute -top-[15%] -right-[5%] w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(160, 185, 220, 0.8) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute top-[20%] -left-[8%] w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(190, 175, 210, 0.6) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute bottom-[0%] right-[10%] w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(170, 195, 200, 0.55) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute top-[50%] left-[30%] w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(180, 200, 225, 0.5) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute top-[5%] left-[20%] w-[350px] h-[350px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(200, 195, 220, 0.4) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(175, 190, 215, 0.45) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}
