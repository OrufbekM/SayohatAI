import { useState } from 'react'
import { meals } from '@/data/meals'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { CARD_SURFACE } from '@/lib/card-styles'

export function MealPlans() {
  const [selected, setSelected] = useState(() => new Set())

  const toggle = (id, checked) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  return (
    <Card className={CARD_SURFACE}>
      <CardHeader className="px-4 pt-4 pb-0">
        <CardTitle className="text-sm font-semibold">Ovqatlanish (Pitaniya)</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {meals.map((meal) => {
            const inputId = `meal-${meal.id}`
            return (
              <div key={meal.id} className="flex items-center gap-2">
                <Checkbox
                  id={inputId}
                  checked={selected.has(meal.id)}
                  onCheckedChange={(value) => toggle(meal.id, value === true)}
                />
                <Label htmlFor={inputId} className="cursor-pointer font-medium">
                  {meal.name}
                </Label>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default MealPlans
