import { MEAL_OPTIONS } from '@/lib/filters'
import { useTours } from '@/hooks/Tours'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { CARD_SURFACE } from '@/lib/card-styles'

export function MealPlans() {
  const { selectedMealIds, toggleMeal } = useTours()

  return (
    <Card className={CARD_SURFACE}>
      <CardHeader className="px-4 pt-4 pb-0">
        <CardTitle className="text-sm font-semibold">Ovqatlanish (Pitaniya)</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {MEAL_OPTIONS.map((meal) => {
            const inputId = `meal-${meal.id}`
            return (
              <div key={meal.id} className="flex items-center gap-2">
                <Checkbox
                  id={inputId}
                  checked={selectedMealIds.has(meal.id)}
                  onCheckedChange={(value) => toggleMeal(meal.id, value === true)}
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
