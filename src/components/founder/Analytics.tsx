import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SURVEY } from "@/data/content";
import { useDemo } from "@/mock/store";
import { ChartValues, SectionHead } from "./shared";

const PIE_COLORS = ["#A9743F", "#C1613D", "#8A6244", "#D9A566", "#6B4632"];

function PieCard({
  title,
  data,
  unit = "%",
}: {
  title: string;
  data: { name: string; value: number }[];
  unit?: string;
}) {
  return (
    <div className="card-cozy p-6">
      <h3 className="text-base text-foreground">{title}</h3>
      <ChartValues data={data} unit={unit} />
      <div className="mt-2 h-64" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              rootTabIndex={-1}
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={45}
              outerRadius={80}
              paddingAngle={3}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => `${v}${unit}`} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function Analytics() {
  const data = useDemo();
  const species = Object.entries(
    data.pets.reduce<Record<string, number>>(
      (acc, p) => ({ ...acc, [p.species]: (acc[p.species] ?? 0) + 1 }),
      {},
    ),
  ).map(([name, value]) => ({ name, value }));
  const services = Object.entries(
    data.bookings.reduce<Record<string, number>>(
      (acc, b) => ({ ...acc, [b.service]: (acc[b.service] ?? 0) + 1 }),
      {},
    ),
  ).map(([name, value]) => ({ name, value }));
  const posts = ["Stories", "Tips", "Questions", "Blogs", "Videos"].map((t) => ({
    name: t,
    value: data.posts.filter((p) => p.type === t && p.status === "published").length,
  }));

  return (
    <>
      <SectionHead
        title="Survey & analytics"
        sub={`Live platform activity, plus what ${SURVEY.respondents.toLocaleString("en-IN")} Delhi NCR pet owners told us in the launch survey.`}
      />

      <h2 className="mb-3 text-lg text-foreground">On the platform</h2>
      <div className="grid gap-6 lg:grid-cols-3">
        <PieCard title="Pets on Digital Collars" data={species} unit="" />
        <PieCard title="Bookings by service" data={services} unit="" />
        <div className="card-cozy p-6">
          <h3 className="text-base text-foreground">Daily Bark posts by type</h3>
          <ChartValues data={posts} unit="" />
          <div className="mt-2 h-64" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={posts}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={11} />
                <Tooltip cursor={{ fill: "rgba(169,116,63,.08)" }} />
                <Bar dataKey="value" fill="#8B5E3C" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <h2 className="mb-3 mt-8 text-lg text-foreground">Launch survey</h2>
      <div className="grid gap-6 lg:grid-cols-2">
        <PieCard title="Which pet do you have?" data={SURVEY.petType} />
        <PieCard title="Biggest struggle as a pet owner" data={SURVEY.biggestStruggle} />
        <PieCard title="Where owners live" data={SURVEY.city} />
        <PieCard title="Monthly spend per pet" data={SURVEY.spend} />
      </div>

      <div className="card-cozy mt-6 p-6">
        <h3 className="text-base text-foreground">
          Feature demand (% of respondents who wanted it)
        </h3>
        <ChartValues data={SURVEY.featureDemand} unit="%" />
        <div className="mt-4 h-72" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SURVEY.featureDemand}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip
                cursor={{ fill: "rgba(169,116,63,.08)" }}
                formatter={(v: number) => `${v}%`}
              />
              <Bar dataKey="value" fill="#C1613D" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
