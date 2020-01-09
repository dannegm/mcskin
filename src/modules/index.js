const modules = [
    'players',
]

export default function buildModules (app) {
    modules.forEach(async module => {
        const router = await import(`./${module}/router`)
        router.default (app)
    })
}