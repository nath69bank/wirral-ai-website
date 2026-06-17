import type { Service } from '../data/pillars'

export default function ServiceCardGrid({ services }: { services: Service[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <div key={service.id} className="glass-panel rounded-2xl p-5 sm:p-6">
          <service.icon className="w-5 h-5 text-green mb-3.5" strokeWidth={1.75} />
          <h4 className="text-white font-medium text-[15px] mb-1.5">{service.name}</h4>
          <p className="text-mist text-sm leading-relaxed">{service.benefit}</p>
        </div>
      ))}
    </div>
  )
}
