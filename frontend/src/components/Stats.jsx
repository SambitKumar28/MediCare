import CountUpModule from "react-countup";

const CountUp = CountUpModule.default || CountUpModule;

const stats = [
  {
    number: 500,
    suffix: "+",
    title: "Verified Doctors",
  },
  {
    number: 10000,
    suffix: "+",
    title: "Happy Patients",
  },
  {
    number: 25,
    suffix: "+",
    title: "Specializations",
  },
  {
    number: 99,
    suffix: "%",
    title: "Success Rate",
  },
];

const Stats = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((item, index) => (
            <div
              key={index}
              className="text-center bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-lg transition"
            >
              <h2 className="text-4xl font-bold text-blue-600 mb-2">
                <CountUp
                  end={item.number}
                  duration={3}
                  enableScrollSpy
                  scrollSpyOnce
                />
                {item.suffix}
              </h2>

              <p className="text-gray-600 font-medium">
                {item.title}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Stats;
